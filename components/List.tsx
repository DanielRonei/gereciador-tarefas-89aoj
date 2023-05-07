/* eslint-disable @next/next/no-img-element */
import { executeRequest } from "@/services/api"
import { Task } from "@/types/Task"
import { NextPage } from "next"
import { useState } from "react"
import { Modal } from "react-bootstrap"
import { Item } from "./Item"

type ListProps = {
    tasks: any,
    getFilteredData(): void
}

export const List:NextPage<ListProps> = ({tasks, getFilteredData}) => {

    // STATES DO MODAL
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [id, setId] = useState<string | null | undefined>(null);
    const [name, setName] = useState('');
    const [finishPrevisionDate, setFinishPrevisionDate] = useState('');
    const [finishDate, setFinishDate] = useState('');

    const closeModal = () => {
        setShowModal(false);
        setId('');
        setName('');
        setFinishPrevisionDate('');
        setFinishDate('');
    }

    const doUpdate =  async () => {
        try{
            setErrorMsg('');
            if( !id || !name || !finishPrevisionDate || !finishDate){
                setErrorMsg('Favor preencher os campos!');
                return
            }

            setLoading(true);

            const body = {
                name,
                finishPrevisionDate,
                finishDate
            };

            await executeRequest('task?id='+id, 'put', body);
            await getFilteredData();
            closeModal();
        }catch(e : any){
            console.log(`Erro ao atualizar tarefa: ${e}`);
            if(e?.response?.data?.error){
                setErrorMsg(e.response.data.error);
            }else{
                setErrorMsg(`Erro ao atualizar tarefa, tente novamente.`);
            }
        }

        setLoading(false);
    }

    const doDelete =  async () => {
        try{
            if( !id){
                return
            }

            setLoading(true);
            
            await executeRequest('task?id='+id, 'delete');
            await getFilteredData();
            closeModal();
        }catch(e : any){
            console.log(`Erro ao deletar tarefa: ${e}`);
            if(e?.response?.data?.error){
                setErrorMsg(e.response.data.error);
            }else{
                setErrorMsg(`Erro ao deletar tarefa, tente novamente.`);
            }
        }

        setLoading(false);
    }

    const selectTask = (t:Task) => {
        setShowModal(true);
        setId(t._id);
        setName(t.name);
        setFinishPrevisionDate(t.finishPrevisionDate);
    }

    return (
        <>
            <div className={"container-list "+ (tasks.length > 0  ? 'not-empty' : '')}>
                {tasks.length > 0 
                    ? 
                        tasks.map((t:any) => <Item key={t._id} task={t} selectTask={selectTask}/>)
                    : 
                    <>
                        <img src="/empty.svg" alt="Nenhuma tarefa encontrada"/>
                        <p>Você ainda não possui tarefas cadastradas!</p>
                    </>
                }
            </div>
            <Modal
                show={showModal}
                onHide={closeModal}
                className="container-modal">
                <Modal.Body>
                    <p>Alterar tarefa</p>
                    {errorMsg && <p className="error">{errorMsg}</p>}
                    <input type='text' placeholder="Nome da tarefa"
                        value={name} onChange={e => setName(e.target.value)}/>
                    <input type='date' placeholder="Previsão de conclusão"
                        value={finishPrevisionDate} onChange={e => setFinishPrevisionDate(e.target.value)}/>
                    <input type='date' placeholder="Data de conclusão"
                        value={finishDate} onChange={e => setFinishDate(e.target.value)}/>
                </Modal.Body>
                <Modal.Footer>
                    <div className="button col-12">
                        <button onClick={doUpdate}>{loading ? '...Carregando' : 'Salvar' }</button>
                        <span onClick={doDelete}>Excluir Tarefa</span>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}